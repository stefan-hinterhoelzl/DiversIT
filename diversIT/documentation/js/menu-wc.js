'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">girlsonly documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AngularMaterialModule.html" data-type="entity-link" >AngularMaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-dae2cbe45eb2e452679ffe383488ced1d87706988ab5836851618b41819cd05207f57d2b174d5344831d09cf1e6feab2dbd7343f4008f0bbcb663bfbf4c32fa7"' : 'data-target="#xs-components-links-module-AppModule-dae2cbe45eb2e452679ffe383488ced1d87706988ab5836851618b41819cd05207f57d2b174d5344831d09cf1e6feab2dbd7343f4008f0bbcb663bfbf4c32fa7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-dae2cbe45eb2e452679ffe383488ced1d87706988ab5836851618b41819cd05207f57d2b174d5344831d09cf1e6feab2dbd7343f4008f0bbcb663bfbf4c32fa7"' :
                                            'id="xs-components-links-module-AppModule-dae2cbe45eb2e452679ffe383488ced1d87706988ab5836851618b41819cd05207f57d2b174d5344831d09cf1e6feab2dbd7343f4008f0bbcb663bfbf4c32fa7"' }>
                                            <li class="link">
                                                <a href="components/AdminPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CenterPanelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CenterPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreatingNewPostCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreatingNewPostCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForumComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForumComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForumThreadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForumThreadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImprintComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImprintComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InterestingMentorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InterestingMentorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JobProfilesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JobProfilesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandingPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LandingPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LeftPanelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LeftPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LeftSpacerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LeftSpacerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginBoxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginBoxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainPanelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MentorSpotlightComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MentorSpotlightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MissionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MissionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageSelectionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageSelectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PostCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrivacyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrivacyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileHeadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileHeadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileNewPostComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileNewPostComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfilePageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilePageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RatingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RatingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RelationsPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RelationsPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RightPanelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RightPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RightPanelProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RightPanelProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RightSpacerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RightSpacerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchFilterSortComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchFilterSortComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SnackbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SnackbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarRatingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarRatingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThreadOverviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThreadOverviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnauthorizedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UnauthorizedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserRatingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRatingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatService.html" data-type="entity-link" >ChatService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ForumService.html" data-type="entity-link" >ForumService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ObserversService.html" data-type="entity-link" >ObserversService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostsService.html" data-type="entity-link" >PostsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RatingService.html" data-type="entity-link" >RatingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminguardService.html" data-type="entity-link" >AdminguardService</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthguardService.html" data-type="entity-link" >AuthguardService</a>
                            </li>
                            <li class="link">
                                <a href="guards/MentorGuardService.html" data-type="entity-link" >MentorGuardService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Answer.html" data-type="entity-link" >Answer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Chat.html" data-type="entity-link" >Chat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Dialog.html" data-type="entity-link" >Dialog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DiversITUser.html" data-type="entity-link" >DiversITUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Post.html" data-type="entity-link" >Post</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PostDisplay.html" data-type="entity-link" >PostDisplay</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Rating.html" data-type="entity-link" >Rating</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Thread.html" data-type="entity-link" >Thread</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});